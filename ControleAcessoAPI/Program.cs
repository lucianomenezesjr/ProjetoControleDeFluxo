using Microsoft.Extensions.Configuration;
using Supabase;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

var supabase = new Supabase.Client(supabaseUrl, supabaseKey, new SupabaseOptions { AutoConnectRealtime = true });
builder.Services.AddSingleton(supabase);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

app.Run();