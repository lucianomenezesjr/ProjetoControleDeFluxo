using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System.ComponentModel.DataAnnotations;

namespace ControleAcessoAPI.Models
{
    [Table("requisicao_de_acesso")]
    public class RequisicaoDeAcesso : BaseModel  // <- aqui é essencial!
    {
        [PrimaryKey("id", false)]
        [Column("id")]
        public int Id { get; set; }

        [Column("aluno_id")]
        public int AlunoId { get; set; }

        [Column("requisicao_por")]
        public int RequisicaoPor { get; set; }

        [Column("status")]
        public string Status { get; set; } = "pendente";

        [Column("motivo")]
        public string Motivo { get; set; } = string.Empty;

        [Column("data_solicitacao")]
        public DateTime DataSolicitacao { get; set; }

        [Column("horario_entrada_ou_saida")]
        public DateTime? HorarioEntradaOuSaida { get; set; }
    }
}
