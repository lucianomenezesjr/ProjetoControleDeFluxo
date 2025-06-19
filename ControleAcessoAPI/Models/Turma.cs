namespace ControleAcessoAPI.Models
{
    public class Turma
    {
        public int Id { get; set; }
        public int CursoId { get; set; }
        public Curso Curso { get; set; } = null!;

        public string Nome { get; set; } = string.Empty;
        public TimeOnly HoraEntradaPadrao { get; set; }
        public TimeOnly HoraSaidaPadrao { get; set; }
        public bool Ativo { get; set; } = true;

        public ICollection<Aluno>? Alunos { get; set; }
    }

}