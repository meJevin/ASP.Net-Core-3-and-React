using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using WebAPI.Data;

namespace WebAPI.Authorization
{
    public class MustBeQuestionAuthorRequirement : IAuthorizationRequirement
    {
        public MustBeQuestionAuthorRequirement()
        {
        }
    }

    public class MustBeQuestionAuthorHandler : AuthorizationHandler<MustBeQuestionAuthorRequirement>
    {
        readonly IDataRepository _dataRepository;
        readonly IHttpContextAccessor _contextAccessor;

        public MustBeQuestionAuthorHandler(
            IDataRepository dataRepository,
            IHttpContextAccessor contextAccessor)
        {
            _dataRepository = dataRepository;
            _contextAccessor = contextAccessor;
        }

        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            MustBeQuestionAuthorRequirement requirement)
        {
            if (!context.User.Identity.IsAuthenticated)
            {
                context.Fail();
                return;
            }

            var questionId = _contextAccessor.HttpContext.Request.RouteValues["questionId"];
            int questionIdInt = Convert.ToInt32(questionId);

            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier).Value;

            var question = await _dataRepository.GetQuestion(questionIdInt);

            if (question == null)
            {
                context.Succeed(requirement);
                return;
            }

            if (question.UserId != userId)
            {
                context.Fail();
                return;
            }

            context.Succeed(requirement);
        }
    }
}
