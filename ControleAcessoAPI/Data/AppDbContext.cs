using Microsoft.EntityFrameworkCore;
using ControleAcessoAPI.Models;
using Supabase.Postgrest; // For ClientOptions, if needed
using ControleAcessoAPI.Models; // usar a versão correta aqui

namespace ControleAcessoAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios => Set<Usuario>();
        public DbSet<Turma> Turmas => Set<Turma>();
        public DbSet<Aluno> Alunos => Set<Aluno>();
        public DbSet<RequisicaoDeAcesso> RequisicoesDeAcesso => Set<RequisicaoDeAcesso>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Turma>().HasIndex(t => t.Nome).IsUnique();
            modelBuilder.Entity<Usuario>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<Aluno>().HasIndex(a => a.Nome).IsUnique();
            modelBuilder.Entity<RequisicaoDeAcesso>().HasIndex(r => r.Id).IsUnique();
        }
    }
}