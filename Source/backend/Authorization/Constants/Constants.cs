using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Authorization.Constants
{
    public static class PolicyNames
    {
        public  const string MustBeQuestionAuthor = "MustBeQuestionAuthor";
    }

    public static class Auth0
    {
        public const string Authority = "https://dev-uhgue5d5.eu.auth0.com/";
        public const string Audience = "https://qanda";
    }
}
