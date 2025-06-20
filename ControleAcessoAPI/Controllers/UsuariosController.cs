using Microsoft.AspNetCore.Mvc;
using Supabase;
using ControleAcessoAPI.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace ControleAcessoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly Supabase.Client _supabase;
    private readonly IConfiguration _configuration;

    public UsuariosController(Supabase.Client supabase, IConfiguration configuration)
    {
        _supabase = supabase ?? throw new ArgumentNullException(nameof(supabase));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Usuario>>> GetAll()
    {
        try
        {
            var result = await _supabase.From<Usuario>().Get();
            return Ok(result.Models);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro interno: {ex.Message}");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Usuario>> GetById(int id)
    {
        try
        {
            var usuario = await _supabase.From<Usuario>().Where(u => u.Id == id).Single();
            if (usuario == null) return NotFound();
            return Ok(usuario);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro interno: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<ActionResult<Usuario>> Create(Usuario usuario)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var funcoesValidas = new[] { "porteiro", "diretor", "coordenador", "opp", "aqv", "bibliotecaria", "docente" };
            if (!funcoesValidas.Contains(usuario.Funcao?.ToLower()))
                return BadRequest("Função inválida.");

            // Hashear a senha antes de salvar
            if (!string.IsNullOrEmpty(usuario.SenhaHash))
            {
                usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuario.SenhaHash);
            }
            else
            {
                return BadRequest("A senha é obrigatória.");
            }

            await _supabase.From<Usuario>().Insert(usuario);
            var responseUsuario = new
            {
                id = usuario.Id,
                nome = usuario.Nome,
                funcao = usuario.Funcao,
                email = usuario.Email,
                ativo = usuario.Ativo
            };
            return CreatedAtAction(nameof(GetById), new { id = usuario.Id }, responseUsuario);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro interno: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Usuario usuario)
    {
        try
        {
            if (id != usuario.Id) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var funcoesValidas = new[] { "porteiro", "diretor", "coordenador", "opp", "aqv", "bibliotecaria", "docente" };
            if (!funcoesValidas.Contains(usuario.Funcao?.ToLower()))
                return BadRequest("Função inválida.");

            if (!string.IsNullOrEmpty(usuario.SenhaHash))
            {
                usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuario.SenhaHash);
            }

            await _supabase.From<Usuario>().Where(u => u.Id == id).Update(usuario);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro interno: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _supabase.From<Usuario>().Where(u => u.Id == id).Delete();
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro interno: {ex.Message}");
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<object>> Login([FromBody] LoginRequest loginRequest)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _supabase.From<Usuario>().Where(u => u.Email == loginRequest.Email).Single();
            if (user == null || !user.Ativo)
            {
                return Unauthorized("Credenciais inválidas ou usuário inativo.");
            }

            // Verificar se a senha fornecida corresponde ao hash armazenado
            if (!BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.SenhaHash))
            {
                return Unauthorized("Credenciais inválidas.");
            }

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                Token = token,
                User = new
                {
                    Id = user.Id,
                    Nome = user.Nome,
                    Funcao = user.Funcao,
                    Email = user.Email,
                    Ativo = user.Ativo
                }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro interno: {ex.Message}");
        }
    }

    private string GenerateJwtToken(Usuario user)
    {
        try
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("Chave JWT não configurada.")));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Funcao)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "your_issuer",
                audience: _configuration["Jwt:Audience"] ?? "your_audience",
                claims: claims,
                expires: DateTime.Now.AddHours(double.Parse(_configuration["Jwt:ExpirationHours"] ?? "1")),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Erro ao gerar o token JWT.", ex);
        }
    }
}