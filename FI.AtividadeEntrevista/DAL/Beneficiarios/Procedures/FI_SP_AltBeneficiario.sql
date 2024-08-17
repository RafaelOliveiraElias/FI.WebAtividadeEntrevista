CREATE PROC FI_SP_AltBeneficiario
    @NOME          VARCHAR (50) ,
	@CPF           VARCHAR (11)  ,
	@IDCLIENTE           BIGINT,
	@Id           BIGINT
AS
BEGIN
	UPDATE BeneficiarioS 
	SET 
		NOME = @NOME, 
		IDCLIENTE = @IDCLIENTE,
		CPF = @CPF
	WHERE Id = @Id
END