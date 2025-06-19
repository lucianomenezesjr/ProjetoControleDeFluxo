namespace ControleAcessoAPI.Models
{
    public class Curso
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int CargaHoraria { get; set; }
        public bool Ativo { get; set; } = true;

        public ICollection<Turma>? Turmas { get; set; }
    }

}

