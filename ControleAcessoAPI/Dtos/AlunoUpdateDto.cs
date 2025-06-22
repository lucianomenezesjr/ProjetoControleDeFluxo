namespace ControleAcessoAPI.Dtos
{
    public class AlunoUpdateDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int? TurmaId { get; set; }
        public bool Ativo { get; set; }
    }
}
