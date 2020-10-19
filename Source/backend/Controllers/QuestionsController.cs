using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Data;
using WebAPI.Data.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        readonly IDataRepository _dataRepository;

        public QuestionsController(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

        [HttpGet]
        public IEnumerable<QuestionGetManyResponse> GetQuestions(string search)
        {
            if (string.IsNullOrEmpty(search))
            {
                return _dataRepository.GetQuestions();
            }

            return _dataRepository.GetQuestionsBySearch(search);
        }

        [HttpGet("unanswered")]
        public IEnumerable<QuestionGetManyResponse> GetUnansweredQuestions()
        {
            return _dataRepository.GetUnansweredQuestions();
        }

        [HttpGet("{questionId}")]
        public ActionResult<QuestionGetSingleResponse> GetQuestion(int questionId)
        {
            var question = _dataRepository.GetQuestion(questionId);

            if (question == null)
            {
                return NotFound();
            }

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
        public ActionResult<QuestionGetSingleResponse> PutQuestion(int questionId, QuestionPutRequest req)
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
            return NoContent();
        }

        [HttpPost("answer")]
        public ActionResult<AnswerGetResponse> PostAnswer(AnswerPostRequest req)
        {
            var questionExists = _dataRepository.QuestionExists(req.QuestionId.Value);

            if (!questionExists)
            {
                return NotFound();
            }

            var savedAnswer = _dataRepository.PostAnswer(req);
            return savedAnswer;
        }
    }
}
