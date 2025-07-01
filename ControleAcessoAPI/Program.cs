using ControleAcessoAPI.Data;
using Microsoft.EntityFrameworkCore;
using Supabase;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Adicionar arquivos de configuração
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// Validar configuração
var configuration = builder.Configuration;
var supabaseUrl = configuration["Supabase:Url"] ?? throw new ArgumentNullException("Supabase:Url", "Missing in appsettings.json.");
var supabaseKey = configuration["Supabase:Key"] ?? throw new ArgumentNullException("Supabase:Key", "Missing in appsettings.json.");
var connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException("DefaultConnection", "Missing in appsettings.json.");

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
builder.Services.AddSwaggerGen();

// Configurar Supabase
builder.Services.AddSingleton<Supabase.Client>(provider =>
{
    var client = new Supabase.Client(supabaseUrl, supabaseKey, new SupabaseOptions
    {
        AutoConnectRealtime = false, // Disable Realtime for now (enable later if needed)
        AutoRefreshToken = true
    });
    return client;
});
builder.Services.AddHostedService<SupabaseInitializer>();

// Configurar AppDbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString)
           .LogTo(Console.WriteLine, LogLevel.Information)
           .EnableSensitiveDataLogging(builder.Environment.IsDevelopment()));

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
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidAudience = configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
        };
    });

builder.Services.AddSingleton<IConfiguration>(configuration);

// Configurar CORS
var corsPolicyName = "AllowNextJS";
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy.AllowAnyOrigin()

        //WithOrigins("http://localhost:3000",
        //                "http://10.109.3.116:3000",
        //                "http://100.76.55.103:3000",
        //                "http://100.84.21.43:3000",
        //                "http://jr-notebook:3000"
        //)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Usar middleware
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

// Hosted service for Supabase initialization
public class SupabaseInitializer : IHostedService
{
    private readonly Supabase.Client _supabaseClient;

    public SupabaseInitializer(Supabase.Client supabaseClient)
    {
        _supabaseClient = supabaseClient;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            Console.WriteLine("Initializing Supabase client...");
            await _supabaseClient.InitializeAsync();
            Console.WriteLine("Supabase client initialized successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Supabase initialization failed: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            throw; // Rethrow to fail startup if initialization is critical
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}