using Supabase;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson; // Adicione este using

var builder = WebApplication.CreateBuilder(args);

// Configuração do JSON usando Newtonsoft
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });

builder.Services.AddEndpointsApiExplorer();

// Configuração do Swagger sem tentar usar AddNewtonsoftJson diretamente
builder.Services.AddSwaggerGen(c =>
{
    // Configurações do Swagger aqui
    // Se precisar configurar o serializador, faça através de DocumentFilter ou outras opções
});

// Configuração do Supabase
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

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();