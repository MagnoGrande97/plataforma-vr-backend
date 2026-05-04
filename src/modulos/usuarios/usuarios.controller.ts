@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Post('invitar')
async invitarUsuario(
  @UsuarioActual() usuarioToken,
  @Body() body: { email: string; nombre: string }
) {
  try {
    const admin = await this.repo.buscarPorAuth0Id(usuarioToken.sub);

    const usuario = await this.repo.crearPorAdmin({
      email: body.email,
      nombre: body.nombre,
      institucionId: admin!.institucionId!,
    });

    // 🔥 EMAIL SIN ROMPER BACKEND
    try {
      await this.emailService.enviarInvitacion(
        body.email,
        body.nombre
      );
    } catch (error) {
      console.error('❌ Error enviando email:', error);
    }

    return usuario;

  } catch (error) {
    console.error('🔥 ERROR INVITAR:', error);
    throw error;
  }
}