using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WebAPI.Data;
using WebAPI.Data.Models;
using WebAPI.Hubs;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        readonly IDataRepository _dataRepository;
        readonly IHubContext<QuestionsHub> _questionHubContext;
        readonly IQuestionCache _cache;

        public QuestionsController(
            IDataRepository dataRepository,
            IHubContext<QuestionsHub> questionHubContext,
            IQuestionCache cache)
        {
            _dataRepository = dataRepository;
            _questionHubContext = questionHubContext;
            _cache = cache;
        }

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

        [HttpGet("unanswered")]
        public async Task<IEnumerable<QuestionGetManyResponse>> GetUnansweredQuestions()
        {
            return await _dataRepository.GetUnansweredQuestionsAsync();
        }

        [HttpGet("{questionId}")]
        public ActionResult<QuestionGetSingleResponse> GetQuestion(int questionId)
        {
            var question = _cache.Get(questionId);

            if (question != null)
            {
                return question;
            }

            question = _dataRepository.GetQuestion(questionId);

            if (question == null)
            {
                return NotFound();
            }
            
            _cache.Set(question);
            return question;
        }

        [HttpPost]
        public ActionResult<QuestionGetSingleResponse> PostQuestion(QuestionPostRequest req)
        {
            var savedQuestion = _dataRepository.PostQuestion(new QuestionPostFullRequest() 
            {
                Content = req.Content,
                Title = req.Title,
                Created = DateTime.UtcNow,
                UserId = "1",
                UserName = "bob.test@test.com",
            });

            return CreatedAtAction(nameof(GetQuestion), 
                new { questionId = savedQuestion.QuestionId },
                savedQuestion);
        }

        [HttpPut]
        public ActionResult<QuestionGetSingleResponse> PutQuestion(
            int questionId, QuestionPutRequest req)
        {
            var question = _dataRepository.GetQuestion(questionId);

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

            var putQuestion = _dataRepository.PutQuestion(questionId, req);

            _cache.Remove(questionId);

            return putQuestion;
        }

        [HttpDelete("{questionId}")]
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
                UserId = "1",
                UserName = "bob.test@test.com",
            });

            _cache.Remove(req.QuestionId.Value);

            await _questionHubContext.Clients.Group($"Question-{req.QuestionId.Value}")
                .SendAsync("ReceiveQuestion", _dataRepository.GetQuestion(req.QuestionId.Value));

            return savedAnswer;
        }
    }
}
