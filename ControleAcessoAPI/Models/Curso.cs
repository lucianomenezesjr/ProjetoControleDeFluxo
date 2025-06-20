using System.ComponentModel.DataAnnotations;

namespace ControleAcessoAPI.Models
{
    public class Curso
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        public int CargaHoraria { get; set; }

        public bool Ativo { get; set; } = true;

        public ICollection<Turma>? Turmas { get; set; }
    }
}