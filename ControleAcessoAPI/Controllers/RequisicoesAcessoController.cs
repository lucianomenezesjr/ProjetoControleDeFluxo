using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleAcessoAPI.Data;
using ControleAcessoAPI.Models;

namespace ControleAcessoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RequisicoesAcessoController : ControllerBase
{
    private readonly AppDbContext _context;

    public RequisicoesAcessoController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RequisicaoDeAcesso>>> GetAll()
    {
        return await _context.RequisicoesDeAcesso
            .Include(r => r.Aluno)
            .Include(r => r.RequisicaoPor)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<RequisicaoDeAcesso>> Create(RequisicaoDeAcesso req)
    {
        _context.RequisicoesDeAcesso.Add(req);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = req.Id }, req);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RequisicaoDeAcesso>> GetById(int id)
    {
        var requisicao = await _context.RequisicoesDeAcesso
            .Include(r => r.Aluno)
            .Include(r => r.RequisicaoPor)
            .FirstOrDefaultAsync(r => r.Id == id);

        return requisicao == null ? NotFound() : Ok(requisicao);
    }

    [HttpPut("{id}/aprovar")]
    public async Task<IActionResult> Aprovar(int id)
    {
        var requisicao = await _context.RequisicoesDeAcesso.FindAsync(id);
        if (requisicao == null) return NotFound();

        requisicao.Status = "aprovada";
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id}/recusar")]
    public async Task<IActionResult> Recusar(int id)
    {
        var requisicao = await _context.RequisicoesDeAcesso.FindAsync(id);
        if (requisicao == null) return NotFound();

        requisicao.Status = "recusada";
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id}/cancelar")]
    public async Task<IActionResult> Cancelar(int id)
    {
        var requisicao = await _context.RequisicoesDeAcesso.FindAsync(id);
        if (requisicao == null) return NotFound();

        requisicao.Status = "cancelada";
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
