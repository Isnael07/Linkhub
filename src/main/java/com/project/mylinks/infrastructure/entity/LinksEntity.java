package com.project.mylinks.infrastructure.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "links")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class LinksEntity {

    @Id
    @SequenceGenerator(name = "links_seq", sequenceName = "links_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "links_seq")
    private long id;
    private String nameUrl;
    private String url;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private UserEntity user;
}
