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
    }
}
