// DTO para criação (POST)
public class RequisicaoDeAcessoDto
{
    
    public int AlunoId { get; set; }
    public int RequisicaoPor { get; set; }
    public string Status { get; set; } = "pendente";
    public string Motivo { get; set; } = string.Empty;
    public DateTime DataSolicitacao { get; set; }
    public DateTime? HorarioEntradaOuSaida { get; set; }
}

// DTO para resposta (GET)
public class RequisicaoAcessoResponseDto
{
    public int Id { get; set; }
    public int AlunoId { get; set; }
    public string AlunoNome { get; set; }
    public string RequisicaoPor { get; set; }
    public string Status { get; set; }
    public string Motivo { get; set; }
    public DateTime DataSolicitacao { get; set; }
    public DateTime? HorarioEntradaOuSaida { get; set; }
}