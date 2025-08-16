package com.toolsai.server.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ai_models")
public class AIModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "model_name")
    private String modelName;

    @Column(name = "model_slug")
    private String modelSlug;

    @Column(name = "model_description")
    private String modelDescription;

    @Column(name = "model_version")
    private String[] modelVersion;

    @Column(name = "model_price")
    private String modelPrice;

    @Column(name = "model_features")
    private String[] modelFeatures;


    @Column(name = "model_status")
    private String modelStatus;

    @Column(name = "model_created_at")
    private String modelCreatedAt;

    @Column(name = "model_updated_at")
    private String modelUpdatedAt;
}
