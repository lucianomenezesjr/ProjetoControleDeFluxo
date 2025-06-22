namespace ControleAcessoAPI.Dtos
{
    public class AlunoCreateDto
    {
        public string Nome { get; set; } = string.Empty;
        public int? TurmaId { get; set; }
        public bool Ativo { get; set; } = true;
    }
}
