using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControleAcessoAPI.Models.EF
{
    [Table("requisicao_de_acesso")]
    public class RequisicaoDeAcessoEF
    {
        [Key]
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column("aluno_id")]
        [Required]
        public int AlunoId { get; set; }

        [Column("requisicao_por")]
        [Required]
        public int RequisicaoPor { get; set; }

        [Column("status")]
        [Required]
        public string Status { get; set; } = "pendente";

        [Column("motivo")]
        [Required]
        public string Motivo { get; set; } = string.Empty;

        [Column("data_solicitacao")]
        [Required]
        public DateTime DataSolicitacao { get; set; }

        [Column("horario_entrada_ou_saida")]
        public DateTime? HorarioEntradaOuSaida { get; set; }

        [ForeignKey("AlunoId")]
        public Aluno? Aluno { get; set; }

        [ForeignKey("RequisicaoPor")]
        public Usuario? RequisicaoPorNavigation { get; set; }
    }
}