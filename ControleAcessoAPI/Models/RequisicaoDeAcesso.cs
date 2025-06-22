using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System.ComponentModel.DataAnnotations;

namespace ControleAcessoAPI.Models
{
    [Table("requisicao_de_acesso")]
    public class RequisicaoDeAcesso : BaseModel
    {
        [PrimaryKey("id")]
        public int Id { get; set; }

        [Column("aluno_id")]
        [Required]
        public int AlunoId { get; set; }

        [Column("requisicao_por")]
        [Required]
        public int RequisicaoPor { get; set; }

        [Column("status")]
        [Required]
        [StringLength(20)]
        public string Status { get; set; } = string.Empty;

        [Column("motivo")]
        [StringLength(200)]
        public string Motivo { get; set; } = string.Empty;

        [Column("data_solicitacao")]
        [Required]
        public DateTime DataSolicitacao { get; set; }

        [Column("horario_entrada_ou_saida")]
        public DateTime? HorarioEntradaOuSaida { get; set; }
    }
}