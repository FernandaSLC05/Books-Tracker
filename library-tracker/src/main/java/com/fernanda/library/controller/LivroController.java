package com.fernanda.library.controller;

import com.fernanda.library.model.Livro;
import com.fernanda.library.repository.LivroRepository;

import com.fernanda.library.service.GoogleBooksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/livros")
@CrossOrigin(origins = "${app.cors.allowed-origins:*}") // Permite que o React converse com o Java

//Essa classe serve para receber os "pedidos" do front
public class LivroController {

    @Autowired // injeção automatica de dependencia e Evita o new
    private LivroRepository repository;

    //Listar todos os livros
    @GetMapping
    public List<Livro> listarTodos(){
        return repository.findAll(); //busca tudo no banco
    }

    @PostMapping
    public Livro cadastrar(@RequestBody Livro livro) {
        return repository.save(livro); //salvar no banco
    }

    @Autowired
    private GoogleBooksService googleService;

    @GetMapping("/buscar-google")
    public Livro testarBuscaGoogle(@RequestParam String titulo) {
        return googleService.buscarLivroNaApi(titulo);
    }

    @DeleteMapping("/{id}")
    public void deletarLivro(@PathVariable Long id) {
        repository.deleteById(id);
    }

}
