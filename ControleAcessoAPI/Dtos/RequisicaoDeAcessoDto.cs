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