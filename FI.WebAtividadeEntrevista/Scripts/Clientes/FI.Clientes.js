
$(document).ready(function () {

    var table = $('#beneficiariosTable tbody');

    $('#addBeneficiario').click(function () {
        var cpf = $('#beneficiarioCPF').val();
        var nome = $('#beneficiarioNome').val();

        var isCpfValido = ValidarCPF(cpf);

        if (!isCpfValido) {
            ModalDialog("Oops...!", "O Cpf informado é inválido");
            return;
        }

        if (checkarCpfTabela(cpf)) {
            ModalDialog("Oops...!", "Já existe um Beneficiário com este CPF.");
            return;
        }


        if (cpf && nome) {
            var row = $('<tr>').append(
                $('<td>').text(cpf),
                $('<td>').text(nome),
                $('<td>').append(
                    $('<button>').addClass('btn btn-warning btn-sm').text('Editar').click(function () {
                        $('#beneficiarioCPF').val(cpf);
                        $('#beneficiarioNome').val(nome);
                        $(this).closest('tr').remove();
                    }),
                    $('<button>').addClass('btn btn-danger btn-sm').text('Excluir').click(function () {
                        $(this).closest('tr').remove();
                    })
                )
            );

            table.append(row);
            $('#formBeneficiarios')[0].reset();
        } else {
            ModalDialog('','Preencha todos os campos.');
        }
    });

    $('#CPF').mask('000.000.000-00', { reverse: true });
    $('#beneficiarioCPF').mask('000.000.000-00', { reverse: true });


    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        var isCpfValido = ValidarCPF($(this).find("#CPF").val());

        if (!isCpfValido) {
            ModalDialog("Oops...!", "O Cpf informado é inválido");
            return;
        }

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "CPF": $(this).find("#CPF").val().replace('.', '').replace('-', '').replace('.', ''),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "BeneficiariosCliente": getBeneficiariosData()
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();
                $('#formBeneficiarios')[0].reset();
                table.empty();
            }
        });
    })
    
})