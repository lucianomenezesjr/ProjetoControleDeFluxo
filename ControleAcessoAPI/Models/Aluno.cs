using System.ComponentModel.DataAnnotations;

namespace ControleAcessoAPI.Models
{
    public class Aluno
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public int TurmaId { get; set; }
        public Turma Turma { get; set; } = null!;

        public bool Ativo { get; set; } = true;

        public ICollection<RequisicaoDeAcesso>? Requisicoes { get; set; }
        public ICollection<RegistroAcesso>? Registros { get; set; }
    }
}