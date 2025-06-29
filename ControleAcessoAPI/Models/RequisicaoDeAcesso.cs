using System;
using System.ComponentModel.DataAnnotations;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace ControleAcessoAPI.Models
{
    [Table("requisicao_de_acesso")]
    public class RequisicaoDeAcesso : BaseModel
    {
        [PrimaryKey("id", false)]
        public int Id { get; set; }

        [Column("aluno_nome")]
        [Required]
        public string AlunoNome { get; set; }

        [Column("requisicao_por")]
        [Required]
        public string RequisicaoPor { get; set; }

        [Column("status")]
        [Required]
        public string Status { get; set; }

        [Column("motivo")]
        public string Motivo { get; set; }

        // Armazena a data completa da solicitação (incluindo horário)
        [Column("data_solicitacao")]
        public string DataSolicitacao { get; set; }

        // Armazena o horário específico de entrada/saída (como timestamp)
        [Column("horario_entrada_ou_saida")]
        public string HorarioEntradaOuSaida { get; set; }
    }
}