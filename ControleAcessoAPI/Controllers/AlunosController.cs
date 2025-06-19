using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleAcessoAPI.Data;
using ControleAcessoAPI.Models;

namespace ControleAcessoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlunosController : ControllerBase
{
    private readonly AppDbContext _context;

    public AlunosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Aluno>>> GetAll()
    {
        return await _context.Alunos
            .Include(a => a.Turma)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Aluno>> GetById(int id)
    {
        var aluno = await _context.Alunos
            .Include(a => a.Turma)
            .FirstOrDefaultAsync(a => a.Id == id);

        return aluno == null ? NotFound() : Ok(aluno);
    }

    [HttpPost]
    public async Task<ActionResult<Aluno>> Create(Aluno aluno)
    {
        _context.Alunos.Add(aluno);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = aluno.Id }, aluno);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Aluno aluno)
    {
        if (id != aluno.Id) return BadRequest();

        _context.Entry(aluno).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var aluno = await _context.Alunos.FindAsync(id);
        if (aluno == null) return NotFound();

        _context.Alunos.Remove(aluno);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
