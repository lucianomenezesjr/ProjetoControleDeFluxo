
namespace ControleAcessoAPI.Models
{
    public class Aluno
    {
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int TurmaId { get; set; }
    public Turma Turma { get; set; } = null!;
    public bool Ativo { get; set; } = true;

    public ICollection<RequisicaoDeAcesso>? Requisicoes { get; set; }
    public ICollection<RegistroAcesso>? Registros { get; set; }
    }

}
