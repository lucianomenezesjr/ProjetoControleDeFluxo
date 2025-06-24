using ControleAcessoAPI.Models;
using ControleAcessoAPI.Dtos;
using Microsoft.AspNetCore.Mvc;
using Supabase;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Supabase.Postgrest;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Responses;  // For Postgrest response types
using Supabase.Postgrest.Exceptions;  // Alternative exception namespace

namespace ControleAcessoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequisicoesAcessoController : ControllerBase
    {
        private readonly Supabase.Client _supabase;

        public RequisicoesAcessoController(Supabase.Client supabase)
        {
            _supabase = supabase ?? throw new ArgumentNullException(nameof(supabase));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RequisicaoAcessoResponseDto>>> GetRequisicoes()
        {
            try
            {
                var requisicoes = await _supabase.From<RequisicaoDeAcesso>().Get();
                var alunos = await _supabase.From<Aluno>().Get();
                var usuarios = await _supabase.From<Usuario>().Get();

                var result = requisicoes.Models.Select(r => new RequisicaoAcessoResponseDto
                {
                    Id = r.Id,
                    AlunoId = r.AlunoId,
                    AlunoNome = alunos.Models.FirstOrDefault(a => a.Id == r.AlunoId)?.Nome ?? "Desconhecido",
                    RequisicaoPor = usuarios.Models.FirstOrDefault(u => u.Id == r.RequisicaoPor)?.Nome ?? "Desconhecido",
                    Status = r.Status,
                    Motivo = r.Motivo,
                    DataSolicitacao = r.DataSolicitacao,
                    HorarioEntradaOuSaida = r.HorarioEntradaOuSaida
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro interno: {ex.Message}" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RequisicaoAcessoResponseDto>> GetById(int id)
        {
            var response = await _supabase.From<RequisicaoDeAcesso>().Where(r => r.Id == id).Get();
            var requisicao = response.Models.FirstOrDefault();

            if (requisicao == null)
                return NotFound();

            var aluno = (await _supabase.From<Aluno>().Where(a => a.Id == requisicao.AlunoId).Get()).Models.FirstOrDefault();
            var usuario = (await _supabase.From<Usuario>().Where(u => u.Id == requisicao.RequisicaoPor).Get()).Models.FirstOrDefault();

            return Ok(new RequisicaoAcessoResponseDto
            {
                Id = requisicao.Id,
                AlunoId = requisicao.AlunoId,
                AlunoNome = aluno?.Nome ?? "Desconhecido",
                RequisicaoPor = usuario?.Nome ?? "Desconhecido",
                Status = requisicao.Status,
                Motivo = requisicao.Motivo,
                DataSolicitacao = requisicao.DataSolicitacao,
                HorarioEntradaOuSaida = requisicao.HorarioEntradaOuSaida
            });
        }

        [HttpPost]
public async Task<ActionResult<RequisicaoAcessoResponseDto>> Create([FromBody] RequisicaoDeAcessoDto dto)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    try
    {
        var alunoTask = _supabase.From<Aluno>().Where(a => a.Id == dto.AlunoId).Get();
        var usuarioTask = _supabase.From<Usuario>().Where(u => u.Id == dto.RequisicaoPor).Get();
        await Task.WhenAll(alunoTask, usuarioTask);

        if (alunoTask.Result.Models.Count == 0 || usuarioTask.Result.Models.Count == 0)
            return BadRequest("Aluno ou usuário não encontrado");

        var novaRequisicao = new RequisicaoDeAcesso
        {
            AlunoId = dto.AlunoId,
            RequisicaoPor = dto.RequisicaoPor,
            Status = dto.Status ?? "pendente",
            Motivo = dto.Motivo ?? string.Empty,
            DataSolicitacao = dto.DataSolicitacao,
            HorarioEntradaOuSaida = dto.HorarioEntradaOuSaida
        };

        var response = await _supabase.From<RequisicaoDeAcesso>().Insert(novaRequisicao); // Remove QueryOptions
        var created = response.Models.First();

        if (created == null)
            return StatusCode(500, "Falha ao criar requisição");

        Console.WriteLine($"Inserted ID: {created.Id}"); // Debug log

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, new RequisicaoAcessoResponseDto
        {
            Id = created.Id,
            AlunoId = created.AlunoId,
            AlunoNome = alunoTask.Result.Models.First().Nome,
            RequisicaoPor = usuarioTask.Result.Models.First().Nome,
            Status = created.Status,
            Motivo = created.Motivo,
            DataSolicitacao = created.DataSolicitacao,
            HorarioEntradaOuSaida = created.HorarioEntradaOuSaida
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Exception: {ex.Message}"); // Log exception
        return StatusCode(500, $"Erro interno: {ex.Message}");
    }
}

        [HttpPut("{id}/recusar")]
        public async Task<IActionResult> Recusar(int id)
        {
            var result = await _supabase.From<RequisicaoDeAcesso>().Where(r => r.Id == id).Get();
            var requisicao = result.Models.FirstOrDefault();

            if (requisicao == null) return NotFound();

            requisicao.Status = "recusada";
            await _supabase.From<RequisicaoDeAcesso>().Where(r => r.Id == id).Update(requisicao);

            return NoContent();
        }

        [HttpPut("{id}/cancelar")]
        public async Task<IActionResult> Cancelar(int id)
        {
            var result = await _supabase.From<RequisicaoDeAcesso>().Where(r => r.Id == id).Get();
            var requisicao = result.Models.FirstOrDefault();

            if (requisicao == null) return NotFound();

            requisicao.Status = "cancelada";
            await _supabase.From<RequisicaoDeAcesso>().Where(r => r.Id == id).Update(requisicao);

            return NoContent();
        }
    }
}