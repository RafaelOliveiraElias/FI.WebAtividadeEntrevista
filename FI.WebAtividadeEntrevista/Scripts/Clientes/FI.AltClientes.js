
$(document).ready(function () {

    $('#CPF').mask('000.000.000-00', { reverse: true });
    $('#beneficiarioCPF').mask('000.000.000-00', { reverse: true });

    var table = $('#beneficiariosTable tbody');

    $('#addBeneficiario').click(function () {
        var cpf = $('#beneficiarioCPF').val();
        var nome = $('#beneficiarioNome').val();
        var id = $('#beneficiarioId').val() || 0;

        var isCpfValido = ValidarCPF(cpf);

        if (!isCpfValido) {
            ModalDialog("Oops...!", "O CPF informado é inválido");
            return;
        }

        if (checkarCpfTabela(cpf)) {
            ModalDialog("Oops...!", "O CPF informado já está cadastrado para esse Cliente.");
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
                        $('#beneficiarioId').val(id); 
                        $(this).closest('tr').remove();
                    }),
                    $('<button>').addClass('btn btn-danger btn-sm').text('Excluir').click(function () {
                        $(this).closest('tr').remove();
                    })
                ),
                $('<td>').append(
                    $('<input>').attr('type', 'hidden').attr('name', 'beneficiarioId').val(id)
                )
            );

            table.append(row);
            $('#formBeneficiarios')[0].reset();
            $('#beneficiarioId').val(0);
        } else {
            ModalDialog('', 'Preencha todos os campos.');
        }
    });


    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #CPF').val(obj.CPF);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);

        if (obj.BeneficiariosCliente) {
            popularBeneficiariosTable(obj.BeneficiariosCliente);
        }
    }



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

                window.location.href = urlRetorno;
            }
        });
    })
    
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

function ValidarCPF(Objcpf) {

    var cpf = $.trim(Objcpf);

    cpf = cpf.replace('.', '');
    cpf = cpf.replace('.', '');
    cpf = cpf.replace('-', '');
    exp = /\.|\-/g;
    cpf = cpf.toString().replace(exp, "");

    while (cpf.length < 11) cpf = "0" + cpf;
    var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
    var a = [];
    var b = new Number;
    var c = 11;
    for (i = 0; i < 11; i++) {
        a[i] = cpf.charAt(i);
        if (i < 9) b += (a[i] * --c);
    }
    if ((x = b % 11) < 2) {
        a[9] = 0;
    }
    else {
        a[9] = 11 - x;
    }
    b = 0;
    c = 11;
    for (y = 0; y < 10; y++)
        b += (a[y] * c--);
    if ((x = b % 11) < 2) {
        a[10] = 0;
    }
    else {
        a[10] = 11 - x;
    }

    var retorno = true;

    if ((cpf.charAt(9) != '' + a[9]) || (cpf.charAt(10) != '' + a[10]) || cpf.match(expReg))
        retorno = false;

    return retorno;
}