using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using WebAPI.Authorization.Constants;
using WebAPI.Data;
using WebAPI.Data.Models;
using WebAPI.Hubs;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class QuestionsController : ControllerBase
    {
        readonly IDataRepository _dataRepository;
        readonly IHubContext<QuestionsHub> _questionHubContext;
        readonly IQuestionCache _cache;

        readonly IHttpClientFactory _httpClientFactory;
        readonly string _auth0UserInfo;

        public QuestionsController(
            IDataRepository dataRepository,
            IHubContext<QuestionsHub> questionHubContext,
            IQuestionCache cache,
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration)
        {
            _dataRepository = dataRepository;
            _questionHubContext = questionHubContext;
            _cache = cache;
            _httpClientFactory = httpClientFactory;

            _auth0UserInfo = $"{configuration["Auth0:Authority"]}userinfo";
        }

        [AllowAnonymous]
        [HttpGet]
        public IEnumerable<QuestionGetManyResponse> GetQuestions(string search, 
            bool includeAnswers, int page = 1, int pageSize = 20)
        {
            if (string.IsNullOrEmpty(search))
            {
                if (includeAnswers)
                {
                    return _dataRepository.GetQuestionsWithAnswers();
                }

                return _dataRepository.GetQuestions();
            }

            return _dataRepository.GetQuestionsBySearchWithPaging(search, page, pageSize);
        }

        [AllowAnonymous]
        [HttpGet("unanswered")]
        public async Task<IEnumerable<QuestionGetManyResponse>> GetUnansweredQuestions()
        {
            return await _dataRepository.GetUnansweredQuestionsAsync();
        }

        [HttpGet("{questionId}")]
        public async Task<ActionResult<QuestionGetSingleResponse>> GetQuestion(int questionId)
        {
            var question = _cache.Get(questionId);

            if (question != null)
            {
                return question;
            }

            question = await _dataRepository.GetQuestion(questionId);

            if (question == null)
            {
                return NotFound();
            }
            
            _cache.Set(question);
            return question;
        }

        [HttpPost]
        public async Task<ActionResult<QuestionGetSingleResponse>> PostQuestion(QuestionPostRequest req)
        {
            var savedQuestion = await _dataRepository.PostQuestion(new QuestionPostFullRequest() 
            {
                Content = req.Content,
                Title = req.Title,
                Created = DateTime.UtcNow,
                UserId = User.FindFirst(ClaimTypes.NameIdentifier).Value,
                UserName = await GetUserName(),
            });

            return CreatedAtAction(nameof(GetQuestion), 
                new { questionId = savedQuestion.QuestionId },
                savedQuestion);
        }

        [HttpPut]
        [Authorize(PolicyNames.MustBeQuestionAuthor)]
        public async Task<ActionResult<QuestionGetSingleResponse>> PutQuestion(
            int questionId, QuestionPutRequest req)
        {
            var question = await _dataRepository.GetQuestion(questionId);

            if (question == null)
            { 
                return NotFound();
            }

            req.Title =
                string.IsNullOrEmpty(req.Title) ?
                question.Title :
                req.Title;

            req.Content =
                string.IsNullOrEmpty(req.Content) ?
                question.Content :
                req.Content;

            var putQuestion = await _dataRepository.PutQuestion(questionId, req);

            _cache.Remove(questionId);

            return putQuestion;
        }

        [HttpDelete("{questionId}")]
        [Authorize(PolicyNames.MustBeQuestionAuthor)]
        public ActionResult DeleteQuestion(int questionId)
        {
            var question = _dataRepository.GetQuestion(questionId);

            if (question == null)
            {
                return NotFound();
            }

            _dataRepository.DeleteQuestion(questionId);

            _cache.Remove(questionId);

            return NoContent();
        }

        [HttpPost("answer")]
        public async Task<ActionResult<AnswerGetResponse>> PostAnswer(AnswerPostRequest req)
        {
            var questionExists = _dataRepository.QuestionExists(req.QuestionId.Value);

            if (!questionExists)
            {
                return NotFound();
            }

            var savedAnswer = _dataRepository.PostAnswer(new AnswerPostFullRequest() 
            {
                Content = req.Content,
                QuestionId = req.QuestionId.Value,
                Created = DateTime.UtcNow,
                UserId = User.FindFirst(ClaimTypes.NameIdentifier).Value,
                UserName = await GetUserName(),
            });

            _cache.Remove(req.QuestionId.Value);

            await _questionHubContext.Clients.Group($"Question-{req.QuestionId.Value}")
                .SendAsync("ReceiveQuestion", _dataRepository.GetQuestion(req.QuestionId.Value));

            return savedAnswer;
        }

        private async Task<string> GetUserName()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, _auth0UserInfo);

            request.Headers.Add("Authorization", Request.Headers["Authorization"].First());

            var client = _httpClientFactory.CreateClient();
            
            var response = await client.SendAsync(request);
            
            if (response.IsSuccessStatusCode)
            {
                var jsonContent = await response.Content.ReadAsStringAsync();

                var user = JsonSerializer.Deserialize<User>(jsonContent,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                return user.Name;
            }
            else
            {
                return "";
            }
        }

    }
}
