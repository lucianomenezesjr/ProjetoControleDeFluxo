using ControleAcessoAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Supabase;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;

namespace ControleAcessoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize] // Protege todas as rotas do controller com autenticação JWT
    public class TurmaController : ControllerBase
    {
        private readonly Supabase.Client _supabase;

        public TurmaController(Supabase.Client supabase)
        {
            _supabase = supabase ?? throw new ArgumentNullException(nameof(supabase));
        }

        // GET: api/Turma
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Turma>>> GetTurmas()
        {
            try
            {
                var response = await _supabase.From<Turma>().Get();
                return Ok(response.Models);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro interno: {ex.Message}" });
            }
        }

        // GET: api/Turma/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Turma>> GetTurma(int id)
        {
            try
            {
                var response = await _supabase.From<Turma>().Where(t => t.Id == id).Get();
                var turma = response.Models.FirstOrDefault();

                if (turma == null)
                {
                    return NotFound(new { message = "Turma não encontrada" });
                }

                return Ok(turma);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro interno: {ex.Message}" });
            }
        }

        // POST: api/Turma
        [HttpPost]
        public async Task<ActionResult<Turma>> CreateTurma([FromBody] Turma turma)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var response = await _supabase.From<Turma>().Insert(turma);
                var createdTurma = response.Models.FirstOrDefault();

                if (createdTurma == null)
                {
                    return StatusCode(500, new { message = "Falha ao criar a turma" });
                }

                return CreatedAtAction(nameof(GetTurma), new { id = createdTurma.Id }, createdTurma);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro interno: {ex.Message}" });
            }
        }

        // PUT: api/Turma/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTurma(int id, [FromBody] Turma turma)
        {
            try
            {
                if (id != turma.Id || !ModelState.IsValid)
                {
                    return BadRequest(new { message = "ID inválido ou dados inválidos" });
                }

                var existingTurma = await _supabase.From<Turma>().Where(t => t.Id == id).Get();
                if (existingTurma.Models.Count == 0)
                {
                    return NotFound(new { message = "Turma não encontrada" });
                }

                var response = await _supabase.From<Turma>().Where(t => t.Id == id).Update(turma);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro interno: {ex.Message}" });
            }
        }

        // DELETE: api/Turma/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTurma(int id)
        {
            try
            {
                var response = await _supabase.From<Turma>().Where(t => t.Id == id).Get();
                var turma = response.Models.FirstOrDefault();

                if (turma == null)
                {
                    return NotFound(new { message = "Turma não encontrada" });
                }

                await _supabase.From<Turma>().Where(t => t.Id == id).Delete();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro interno: {ex.Message}" });
            }
        }
    }
}