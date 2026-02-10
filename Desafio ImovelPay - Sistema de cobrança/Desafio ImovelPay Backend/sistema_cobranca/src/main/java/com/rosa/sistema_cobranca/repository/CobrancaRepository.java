package com.rosa.sistema_cobranca.repository;

import com.rosa.sistema_cobranca.entity.Cobranca;
import org.springframework.data.jpa.repository.JpaRepository;

@SuppressWarnings("NullableProblems")// Desativa os avisos do IntelliJ sobre valores nulos para manter o código limpo.
public interface CobrancaRepository extends JpaRepository<Cobranca, Long> {
}


