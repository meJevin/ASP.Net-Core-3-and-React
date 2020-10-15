using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Data.Models;

namespace WebAPI.Data
{
    public class DataRepository : IDataRepository
    {
        private readonly string _connectionString;

        public DataRepository(IConfiguration configuration)
        {
            _connectionString = configuration["ConnectionStrings:SQLServerConnection_Local"];
        }

        public AnswerGetResponse GetAnswer(int answerId)
        {
            using var connection = new SqlConnection(_connectionString);
            
            connection.Open();

            return connection.QueryFirstOrDefault<AnswerGetResponse>(
                @"EXEC dbo.Answer_Get_ByAnswerId @AnswerId = @AnswerId",
                new { AnswerId = answerId }
            );
        }

        public QuestionGetSingleResponse GetQuestion(int questionId)
        {
            using var connection = new SqlConnection(_connectionString);

            connection.Open();

            var question = connection.QueryFirstOrDefault<QuestionGetSingleResponse>(
                @"EXEC dbo.Question_GetSingle @QuestionId = @QuestionId",
                new { QuestionId = questionId }
            );

            if (question != null)
            {
                question.Answers = connection.Query<AnswerGetResponse>(
                    @"EXEC dbo.Question_Get_ByQuestionId @QuestionId = @QuestionId",
                    new { QuestionId = questionId }
                );
            }

            return question;
        }

        public IEnumerable<QuestionGetManyResponse> GetQuestions()
        {
            using var connection = new SqlConnection(_connectionString);

            connection.Open();

            return connection.Query<QuestionGetManyResponse>(
                @"EXEC dbo.Question_GetMany"
            );
        }

        public IEnumerable<QuestionGetManyResponse> GetQuestionsBySearch(string search)
        {
            using var connection = new SqlConnection(_connectionString);

            connection.Open();

            return connection.Query<QuestionGetManyResponse>(
                @"EXEC dbo.Question_GetMany_By_Search @Search = @Search",
                new { Search = search } 
            );
        }

        public IEnumerable<QuestionGetManyResponse> GetUnansweredQuestions()
        {
            using var connection = new SqlConnection(_connectionString);

            connection.Open();

            return connection.Query<QuestionGetManyResponse>(
                @"EXEC dbo.Question_GetUnanswered"
            );
        }

        public bool QuestionExists(int questionId)
        {
            using var connection = new SqlConnection(_connectionString);

            connection.Open();

            return connection.QueryFirst<bool>(
                @"EXEC dbo.Question_Exists @QuestionId = @QuestionId",
                new { QuestionId = questionId }
            );
        }
    }
}
