namespace ControleAcessoAPI.Models
{
    public class RegistroAcesso
    {
        public int Id { get; set; }

        public int AlunoId { get; set; }
        public Aluno Aluno { get; set; } = null!;

        public DateTime DataEntrada { get; set; }
        public DateTime? DataSaida { get; set; }

        public int? AcessoAutorizadoPorId { get; set; }
        public Usuario? AcessoAutorizadoPor { get; set; }

        public string Tipo { get; set; } = "entrada"; // entrada ou saida
        public string? Observacoes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}

