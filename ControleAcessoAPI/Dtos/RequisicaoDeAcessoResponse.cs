using System;

namespace ControleAcessoAPI.Models
{
    public class RequisicaoDeAcessoResponse
    {
        public int Id { get; set; }
        public int? AlunoId { get; set; }
        public string NomeAluno { get; set; }
        public string RequisicaoPor { get; set; }
        public string Status { get; set; }
        public string Motivo { get; set; }
        public DateTime DataSolicitacao { get; set; }
        public TimeSpan HorarioEntradaOuSaida { get; set; }
    }
}