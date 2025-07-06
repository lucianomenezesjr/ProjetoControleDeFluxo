using Microsoft.AspNetCore.Mvc;
using Supabase;
using ControleAcessoAPI.Models;
using Supabase.Postgrest.Exceptions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace ControleAcessoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequisicaoDeAcessoController : ControllerBase
    {
        private readonly Client _supabaseClient;

        public RequisicaoDeAcessoController(Client supabaseClient)
        {
            _supabaseClient = supabaseClient;
        }

        [HttpPost]
        public async Task<IActionResult> Create(RequisicaoDeAcesso requisicao)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var response = await _supabaseClient
                    .From<RequisicaoDeAcesso>()
                    .Insert(requisicao);

                if (response.Models == null || response.Models.Count == 0)
                {
                    return BadRequest("Erro ao criar a requisição de acesso.");
                }

                return CreatedAtAction(nameof(Create), new { id = response.Models[0].Id }, response.Models[0]);
            }
            catch (PostgrestException ex)
            {
                return StatusCode(400, $"Erro no Supabase: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var response = await _supabaseClient
                    .From<RequisicaoDeAcesso>()
                    .Get();

                if (response.Models == null)
                {
                    return NotFound("Nenhuma requisição de acesso encontrada.");
                }

                return Ok(response.Models);
            }
            catch (PostgrestException ex)
            {
                return StatusCode(400, $"Erro no Supabase: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var response = await _supabaseClient
                    .Rpc("get_requisicao_de_acesso_by_id", new Dictionary<string, object> { { "p_id", id } });

                if (response.Content == null)
                {
                    return NotFound($"Requisição de acesso com ID {id} não encontrada.");
                }

                var requisicoes = JsonConvert.DeserializeObject<List<RequisicaoDeAcessoResponse>>(response.Content);

                if (requisicoes == null || requisicoes.Count == 0)
                {
                    return NotFound($"Requisição de acesso com ID {id} não encontrada.");
                }

                return Ok(requisicoes[0]);
            }
            catch (PostgrestException ex)
            {
                return StatusCode(400, $"Erro no Supabase: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            try
            {
                var response = await _supabaseClient
                    .From<RequisicaoDeAcesso>()
                    .Where(x => x.Id == id)
                    .Set(x => x.Status, request.Status)
                    .Update();

                return Ok(response.Models?.FirstOrDefault());
            }
            catch (PostgrestException ex)
            {
                return BadRequest($"Erro no Supabase: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var existingRequisicao = await _supabaseClient
                    .From<RequisicaoDeAcesso>()
                    .Where(x => x.Id == id)
                    .Single();

                if (existingRequisicao == null)
                {
                    return NotFound($"Requisição de acesso com ID {id} não encontrada.");
                }

                await _supabaseClient
                    .From<RequisicaoDeAcesso>()
                    .Where(x => x.Id == id)
                    .Delete();

                return NoContent();
            }
            catch (PostgrestException ex)
            {
                return StatusCode(400, $"Erro no Supabase: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }
    }

    public class UpdateStatusRequest
    {
        public string Status { get; set; }
    }
}