using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using DbUp;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using WebAPI.Authorization;
using WebAPI.Authorization.Constants;
using WebAPI.Data;
using WebAPI.Hubs;

namespace WebAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var envName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            
            // Get connection string injected by azure app service
            var connectionString = Configuration["ConnectionStrings:SQLServerConnection_Azure"];
            
            if (envName == "Development")
            {
                // In development use local connection string
                connectionString = Configuration["ConnectionStrings:SQLServerConnection_Local"];
            }

            EnsureDatabase.For.SqlDatabase(connectionString);

            var upgrader = DeployChanges.To.SqlDatabase(connectionString, null)
                .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
                .WithTransaction()
                .LogToConsole()
                .Build();

            if (upgrader.IsUpgradeRequired())
            {
                upgrader.PerformUpgrade();
            }

            services.AddControllers();

            services.AddScoped<IDataRepository, DataRepository>();

            services.AddSignalR();

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder =>
                {
                    builder
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .WithOrigins(Configuration["Frontend"]);
                });
            });

            services.AddMemoryCache();
            services.AddSingleton<IQuestionCache, QuestionCache>();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.Authority = Configuration["Auth0:Authority"];
                options.Audience = Configuration["Auth0:Audience"];
            });

            services.AddHttpClient();
            services.AddAuthorization(options =>
            {
                options.AddPolicy(PolicyNames.MustBeQuestionAuthor, p => 
                {
                    p.Requirements.Add(new MustBeQuestionAuthorRequirement());
                });
            });

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("CorsPolicy");

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<QuestionsHub>("/questionshub");
            });
        }
    }
}
