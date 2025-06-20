using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace ControleAcessoAPI.Models
{
    [Table("usuario")]
    public class Usuario : BaseModel
    {
        [PrimaryKey("id")]
        public int Id { get; set; }

        [Column("nome")]
        [Required]
        [StringLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Column("funcao")]
        [Required]
        [StringLength(30)]
        [RegularExpression("porteiro|diretor|coordenador|opp|aqv|bibliotecaria|docente", ErrorMessage = "Função inválida.")]
        public string Funcao { get; set; } = string.Empty;

        [Column("email")]
        [Required]
        [StringLength(50)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Column("senha_hash")]
        public string SenhaHash { get; set; } = string.Empty;

        [Column("ativo")]
        public bool Ativo { get; set; } = true;
    }

}