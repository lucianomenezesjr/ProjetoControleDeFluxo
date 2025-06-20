using Supabase;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Adicionar arquivos de configuração
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// Configurar serviços
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver
        {
            NamingStrategy = new Newtonsoft.Json.Serialization.CamelCaseNamingStrategy
            {
                ProcessDictionaryKeys = true,
                OverrideSpecifiedNames = true
            }
        };
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Configurações do Swagger
});

// Configurar Supabase
var supabaseUrl = builder.Configuration["Supabase:Url"];
if (string.IsNullOrEmpty(supabaseUrl))
{
    throw new ArgumentNullException(nameof(supabaseUrl), "A URL do Supabase não foi configurada no appsettings.json.");
}

var supabaseKey = builder.Configuration["Supabase:Key"];
if (string.IsNullOrEmpty(supabaseKey))
{
    throw new ArgumentNullException(nameof(supabaseKey), "A chave do Supabase não foi configurada no appsettings.json.");
}

builder.Services.AddSingleton(provider =>
{
    var client = new Supabase.Client(supabaseUrl, supabaseKey, new SupabaseOptions
    {
        AutoConnectRealtime = true,
        AutoRefreshToken = true
    });

    client.InitializeAsync().Wait();
    return client;
});

// Configurar autenticação JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

// Configurar CORS antes de Build
var corsPolicyName = "AllowNextJS";
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Next.js dev
              .AllowAnyHeader()
              .AllowAnyMethod();
        //.AllowCredentials(); // Descomente se usar cookies
    });
});

var app = builder.Build();

// Usar middleware CORS
app.UseCors(corsPolicyName);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();