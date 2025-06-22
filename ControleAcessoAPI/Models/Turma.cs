using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System.ComponentModel.DataAnnotations;

namespace ControleAcessoAPI.Models
{
    [Table("turma")]
    public class Turma : BaseModel
    {
        [PrimaryKey("id")]
        public int Id { get; set; }

        [Column("nome")]
        [Required]
        [StringLength(50)]
        public string Nome { get; set; } = string.Empty;

        [Column("ativo")]
        public bool Ativo { get; set; } = true;

        // Propriedade de navegação (opcional, carregada manualmente)
        // public List<Aluno> Alunos { get; set; } = new List<Aluno>();
    }
}