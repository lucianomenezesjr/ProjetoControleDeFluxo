using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleAcessoAPI.Models;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly Supabase.Client _supabase;

    public UsuariosController(Supabase.Client supabase)
    {
        _supabase = supabase ?? throw new ArgumentNullException(nameof(supabase));
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

    [HttpPost]
    public async Task<ActionResult<Usuario>> Create(Usuario usuario)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var funcoesValidas = new[] { "porteiro", "diretor", "coordenador", "opp", "aqv", "bibliotecaria", "docente" };
            if (!funcoesValidas.Contains(usuario.Funcao?.ToLower()))
                return BadRequest("Função inválida.");

            await _supabase.From<Usuario>().Insert(usuario);
            return CreatedAtAction(nameof(GetById), new { id = usuario.Id }, usuario);
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

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Usuario usuario)
    {
        try
        {
            if (id != usuario.Id) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
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
}