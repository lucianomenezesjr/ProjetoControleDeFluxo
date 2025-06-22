using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System.ComponentModel.DataAnnotations;

namespace ControleAcessoAPI.Models
{
    [Table("aluno")]
    public class Aluno : BaseModel
    {
        [PrimaryKey("id")]
        [Column("id")]
        public int Id { get; set; }

        [Column("nome")]
        [Required]
        [StringLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Column("turma_id")]
        public int? TurmaId { get; set; } // Chave estrangeira opcional

        [Column("ativo")]
        public bool Ativo { get; set; } = true;

        // Removida a propriedade de navegação Turma para evitar confusão
        // Se precisar, carregue manualmente no controller
    }
}