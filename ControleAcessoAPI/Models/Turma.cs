using System.ComponentModel.DataAnnotations;

namespace ControleAcessoAPI.Models
{
    public class Turma
    {
        public int Id { get; set; }

        [Required]
        public int CursoId { get; set; }
        public Curso Curso { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        public TimeOnly HoraEntradaPadrao { get; set; }

        [Required]
        public TimeOnly HoraSaidaPadrao { get; set; }

        public bool Ativo { get; set; } = true;

        public ICollection<Aluno>? Alunos { get; set; }
    }
}