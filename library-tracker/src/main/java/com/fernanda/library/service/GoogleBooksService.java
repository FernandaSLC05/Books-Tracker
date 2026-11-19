package com.fernanda.library.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fernanda.library.model.FormatoLivro;
import com.fernanda.library.model.Livro;
import com.fernanda.library.model.StatusLeitura;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class GoogleBooksService {

    @Value("${google.books.api-key:}")
    private String apiKey;

    public Livro buscarLivroNaApi(String tituloDesejado) {
        try {
            String tituloFormatado = URLEncoder.encode(tituloDesejado, StandardCharsets.UTF_8);

            String url = "https://www.googleapis.com/books/v1/volumes?q=intitle:" + tituloFormatado;
            if (apiKey != null && !apiKey.isBlank()) {
                url += "&key=" + apiKey;
            }

            RestTemplate restTemplate = new RestTemplate();
            String respostaGoogle = restTemplate.getForObject(url, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode raiz = mapper.readTree(respostaGoogle);
            JsonNode itens = raiz.path("items");

            if (itens.isMissingNode() || !itens.isArray() || itens.isEmpty()) {
                return null;
            }

            JsonNode volumeInfo = itens.get(0).path("volumeInfo");

            Livro livro = new Livro();
            livro.setTitulo(volumeInfo.path("title").asText("Título desconhecido"));
            livro.setPaginasTotais(volumeInfo.path("pageCount").asInt(0));
            livro.setStatus(StatusLeitura.QUERO_LER);
            livro.setFormato(FormatoLivro.FISICO);

            JsonNode autores = volumeInfo.path("authors");
            if (autores.isArray() && !autores.isEmpty()) {
                livro.setAutor(autores.get(0).asText());
            } else {
                livro.setAutor("Autor desconhecido");
            }

            // ---Lógica para extrair a capa ---
            if (volumeInfo.has("imageLinks")) {
                JsonNode imageLinks = volumeInfo.get("imageLinks");
                if (imageLinks.has("thumbnail")) {
                    livro.setCapaUrl(imageLinks.get("thumbnail").asText());
                } else if (imageLinks.has("smallThumbnail")) {
                    livro.setCapaUrl(imageLinks.get("smallThumbnail").asText());
                }
            }
            // Se o livro não tiver a pasta "imageLinks" lá no Google,
            // o Java simplesmente ignora e não quebra o código!

            return livro;

        } catch (Exception e) {
            System.out.println("Erro ao buscar no Google ou processar JSON: " + e.getMessage());
            return null;
        }
    }
}