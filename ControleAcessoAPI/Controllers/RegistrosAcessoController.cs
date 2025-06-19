using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleAcessoAPI.Data;
using ControleAcessoAPI.Models;

namespace ControleAcessoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RegistrosAcessoController : ControllerBase
{
    private readonly AppDbContext _context;

    public RegistrosAcessoController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RegistroAcesso>>> GetAll()
    {
        return await _context.RegistrosAcesso
            .Include(r => r.Aluno)
            .Include(r => r.AcessoAutorizadoPor)
            .ToListAsync();
    }

    [HttpPost("entrada")]
    public async Task<IActionResult> RegistrarEntrada([FromBody] int alunoId)
    {
        var registro = new RegistroAcesso
        {
            AlunoId = alunoId,
            Tipo = "entrada",
            DataEntrada = DateTime.UtcNow
        };

        _context.RegistrosAcesso.Add(registro);
        await _context.SaveChangesAsync();

        return Ok(registro);
    }

    [HttpPost("saida/{registroId}")]
    public async Task<IActionResult> RegistrarSaida(int registroId)
    {
        var registro = await _context.RegistrosAcesso.FindAsync(registroId);
        if (registro == null || registro.DataSaida != null)
            return NotFound("Registro inexistente ou já finalizado.");

        registro.DataSaida = DateTime.UtcNow;
        registro.Tipo = "saida";

        await _context.SaveChangesAsync();

        return Ok(registro);
    }
}
