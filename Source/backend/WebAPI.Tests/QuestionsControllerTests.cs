using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Controllers;
using WebAPI.Data;
using WebAPI.Data.Models;
using Xunit;

namespace WebAPI.Tests
{
    public class QuestionsControllerTests
    {
        [Fact]
        public async void GetQuestions_WhenNoParameters_ReturnsAllQuestions()
        {
            var mockQuestions = new List<QuestionGetManyResponse>();
            for (int i = 1; i <= 10; i++)
            {
                mockQuestions.Add(new QuestionGetManyResponse
                {
                    QuestionId = 1,
                    Title = $"Test title {i}",
                    Content = $"Test content {i}",
                    UserName = "User1",
                    Answers = new List<AnswerGetResponse>()
                });
            }

            var mockDataRepo = new Mock<IDataRepository>();
            mockDataRepo
                .Setup(repo => repo.GetQuestions())
                .Returns(() => mockQuestions.AsEnumerable());

            var mockConfig = new Mock<IConfigurationRoot>();
            mockConfig
                .SetupGet(config => config[It.IsAny<string>()])
                .Returns("String");

            var questionsController = new QuestionsController(
                mockDataRepo.Object,
                null, null, null,
                mockConfig.Object);

            var result = questionsController.GetQuestions(null, false);

            Assert.Equal(mockQuestions.Count, result.Count());
            mockDataRepo.Verify(mock => mock.GetQuestions(), Times.Once());
        }

        [Fact]
        public async void GetQuestions_WhenHaveSearchParameter_ReturnsCorrectQuestions()
        {
            var mockQuestions = new List<QuestionGetManyResponse>();

            mockQuestions.Add(new QuestionGetManyResponse
            {
                QuestionId = 1,
                Title = "Test",
                Content = "Test content",
                UserName = "User1",
                Answers = new List<AnswerGetResponse>()
            });

            var mockDataRepo = new Mock<IDataRepository>();
            mockDataRepo
                .Setup(repo => repo.GetQuestionsBySearchWithPaging("Test", 1, 20))
                .Returns(() => mockQuestions.AsEnumerable());

            var mockConfig = new Mock<IConfigurationRoot>();
            mockConfig
                .SetupGet(config => config[It.IsAny<string>()])
                .Returns("String");

            var questionsController = new QuestionsController(
                mockDataRepo.Object,
                null, null, null,
                mockConfig.Object);

            var result = questionsController.GetQuestions("Test", false);
            Assert.Single(result);
            mockDataRepo.Verify(mock => mock.GetQuestionsBySearchWithPaging("Test", 1, 20), Times.Once());
        }

        [Fact]
        public async void GetQuestion_WhenQuestionNotFound_Returns404()
        {
            var mockQuestionCache = new Mock<IQuestionCache>();
            mockQuestionCache
                .Setup(cache => cache.Get(1))
                .Returns(() => null);

            var mockDataRepo = new Mock<IDataRepository>();
            mockDataRepo
                .Setup(repo => repo.GetQuestion(1))
                .Returns(() => Task.FromResult(default(QuestionGetSingleResponse)));

            var mockConfig = new Mock<IConfigurationRoot>();
            mockConfig
                .SetupGet(config => config[It.IsAny<string>()])
                .Returns("String");

            var questionsController = new QuestionsController(
                mockDataRepo.Object,
                null, mockQuestionCache.Object, null,
                mockConfig.Object);

            var result = await questionsController.GetQuestion(1);

            var actionResult = Assert.IsType<ActionResult<QuestionGetSingleResponse>>(result);
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }

        [Fact]
        public async void GetQuestion_WhenQuestionIsFound_ReturnsQuestion()
        {
            var mockQuestion = new QuestionGetSingleResponse
            {
                QuestionId = 1,
                Title = "test"
            };

            var mockQuestionCache = new Mock<IQuestionCache>();
            mockQuestionCache
                .Setup(cache => cache.Get(1))
                .Returns(() => null);

            var mockDataRepo = new Mock<IDataRepository>();
            mockDataRepo
                .Setup(repo => repo.GetQuestion(1))
                .Returns(() => Task.FromResult(mockQuestion));

            var mockConfig = new Mock<IConfigurationRoot>();
            mockConfig
                .SetupGet(config => config[It.IsAny<string>()])
                .Returns("String");

            var questionsController = new QuestionsController(
                mockDataRepo.Object,
                null, mockQuestionCache.Object, null,
                mockConfig.Object);

            var result = await questionsController.GetQuestion(1);

            var actionResult = Assert.IsType<ActionResult<QuestionGetSingleResponse>>(result);
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }
    }
}
