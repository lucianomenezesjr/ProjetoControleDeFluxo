using ControleAcessoAPI.Models;
using ControleAcessoAPI.Dtos;
using Microsoft.AspNetCore.Mvc;
using Supabase;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

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
        public async Task<ActionResult<RequisicaoDeAcesso>> Create([FromBody] RequisicaoDeAcessoDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var nova = new RequisicaoDeAcesso
            {
                AlunoId = dto.AlunoId,
                RequisicaoPor = dto.RequisicaoPor,
                Status = dto.Status,
                Motivo = dto.Motivo,
                DataSolicitacao = dto.DataSolicitacao,
                HorarioEntradaOuSaida = dto.HorarioEntradaOuSaida
            };

            var insert = await _supabase.From<RequisicaoDeAcesso>().Insert(nova);
            var created = insert.Models.FirstOrDefault();

            if (created == null)
                return StatusCode(500, new { message = "Erro ao criar requisição" });

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
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