using Microsoft.EntityFrameworkCore;
using ControleAcessoAPI.Models;
using Supabase.Postgrest; // For ClientOptions, if needed
using ControleAcessoAPI.Models.EF; // usar a versão correta aqui

namespace ControleAcessoAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios => Set<Usuario>();
        public DbSet<Turma> Turmas => Set<Turma>();
        public DbSet<Aluno> Alunos => Set<Aluno>();
        public DbSet<ControleAcessoAPI.Models.EF.RequisicaoDeAcesso> RequisicoesDeAcesso => Set<ControleAcessoAPI.Models.EF.RequisicaoDeAcesso>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Turma>().HasIndex(t => t.Nome).IsUnique();
            modelBuilder.Entity<Usuario>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<Aluno>().HasIndex(a => a.Nome).IsUnique();

            modelBuilder.Entity<ControleAcessoAPI.Models.EF.RequisicaoDeAcesso>(entity =>
            {
                entity.ToTable("requisicao_de_acesso");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.AlunoId).HasColumnName("aluno_id");
                entity.Property(e => e.RequisicaoPor).HasColumnName("requisicao_por");
                entity.Property(e => e.Status).HasColumnName("status");
                entity.Property(e => e.Motivo).HasColumnName("motivo");
                entity.Property(e => e.DataSolicitacao).HasColumnName("data_solicitacao");
                entity.Property(e => e.HorarioEntradaOuSaida).HasColumnName("horario_entrada_ou_saida");

                entity.HasOne(r => r.Aluno)
                    .WithMany()
                    .HasForeignKey(r => r.AlunoId)
                    .IsRequired(false);

                entity.HasOne(r => r.RequisicaoPorNavigation)
                    .WithMany()
                    .HasForeignKey(r => r.RequisicaoPor)
                    .IsRequired(false);
            });
        }
    }
}
