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
    //[Authorize]
    public class AlunosController : ControllerBase
    {
        private readonly Supabase.Client _supabase;

        public AlunosController(Supabase.Client supabase)
        {
            _supabase = supabase ?? throw new ArgumentNullException(nameof(supabase));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Aluno>>> GetAlunos()
        {
            try
            {
                var response = await _supabase.From<Aluno>().Get();
                return Ok(response.Models);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro interno: {ex.Message}" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Aluno>> GetAluno(int id)
        {
            try
            {
                var response = await _supabase.From<Aluno>().Where(a => a.Id == id).Get();
                var aluno = response.Models.FirstOrDefault();

                if (aluno == null)
                {
                    return NotFound(new { message = "Aluno não encontrado" });
                }

                // Carregar Turma manualmente, se TurmaId existir
                if (aluno.TurmaId.HasValue)
                {
                    var turmaResponse = await _supabase.From<Turma>().Where(t => t.Id == aluno.TurmaId.Value).Get();
                    var turma = turmaResponse.Models.FirstOrDefault();
                    // Adicionar Turma como um objeto separado na resposta, se desejar
                    return Ok(new
                    {
                        aluno.Id,
                        aluno.Nome,
                        aluno.TurmaId,
                        aluno.Ativo,
                        Turma = turma
                    });
                }

                return Ok(aluno);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro interno: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAluno(int id, [FromBody] Aluno aluno)
        {
            try
            {
                if (id != aluno.Id || !ModelState.IsValid)
                {
                    return BadRequest(new { message = "ID inválido ou dados inválidos" });
                }

                var existingAluno = await _supabase.From<Aluno>().Where(a => a.Id == id).Get();
                if (existingAluno.Models.Count == 0)
                {
                    return NotFound(new { message = "Aluno não encontrado" });
                }

                var updateData = new Aluno
                {
                    Id = aluno.Id,
                    Nome = aluno.Nome,
                    TurmaId = aluno.TurmaId,
                    Ativo = aluno.Ativo
                };

                var response = await _supabase.From<Aluno>().Where(a => a.Id == id).Update(updateData);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro interno: {ex.Message}" });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Aluno>> CreateAluno([FromBody] Aluno aluno)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                aluno.Id = 0; // Força o Supabase a gerar um novo ID

                // Validar TurmaId, se fornecido
                if (aluno.TurmaId.HasValue)
                {
                    var turmaResponse = await _supabase.From<Turma>().Where(t => t.Id == aluno.TurmaId.Value).Get();
                    if (!turmaResponse.Models.Any())
                    {
                        ModelState.AddModelError("TurmaId", "A Turma especificada não existe.");
                        return BadRequest(ModelState);
                    }
                }

                var response = await _supabase.From<Aluno>().Insert(aluno);
                var createdAluno = response.Models.FirstOrDefault();

                if (createdAluno == null)
                {
                    return StatusCode(500, new { message = "Falha ao criar o aluno" });
                }

                // Carregar Turma manualmente, se desejar
                if (createdAluno.TurmaId.HasValue)
                {
                    var turmaResponse = await _supabase.From<Turma>().Where(t => t.Id == createdAluno.TurmaId.Value).Get();
                    var turma = turmaResponse.Models.FirstOrDefault();
                    return Ok(new
                    {
                        createdAluno.Id,
                        createdAluno.Nome,
                        createdAluno.TurmaId,
                        createdAluno.Ativo,
                        Turma = turma
                    });
                }

                return CreatedAtAction(nameof(GetAluno), new { id = createdAluno.Id }, createdAluno);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro interno: {ex.Message}" });
            }
        }
    }
}