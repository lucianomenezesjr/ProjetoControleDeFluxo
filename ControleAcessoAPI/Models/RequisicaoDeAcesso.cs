using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System;

namespace ControleAcessoAPI.Models
{
    [Table("requisicao_de_acesso")]
    public class RequisicaoDeAcesso : BaseModel
    {
        [PrimaryKey("id", false)]
        public int Id { get; set; }

        [Column("aluno_id")]
        [Required(ErrorMessage = "O ID do aluno é obrigatório")]
        public int AlunoId { get; set; }

        [Column("requisicao_por")]
        [Required(ErrorMessage = "O campo requisicao_por é obrigatório")]
        [StringLength(100, ErrorMessage = "O campo requisicao_por deve ter no máximo 100 caracteres")]
        public string RequisicaoPor { get; set; }

        [Column("status")]
        [Required(ErrorMessage = "O status é obrigatório")]
        [StringLength(50, ErrorMessage = "O status deve ter no máximo 50 caracteres")]
        public string Status { get; set; }

        [Column("motivo")]
        [StringLength(500, ErrorMessage = "O motivo deve ter no máximo 500 caracteres")]
        public string Motivo { get; set; }

        [Column("data_solicitacao")]
        [Required(ErrorMessage = "A data de solicitação é obrigatória")]
        public DateTime DataSolicitacao { get; set; }

        [Column("horario_entrada_ou_saida")]
        [Required(ErrorMessage = "O horário de entrada ou saída é obrigatório")]
        public DateTime HorarioEntradaOuSaida { get; set; }
    }
}