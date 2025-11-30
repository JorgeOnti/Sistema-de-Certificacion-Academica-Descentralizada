// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Sistema de Certificación Académica simplificado para demo en Hardhat
contract AcademicCertificate {

    struct Certificate {
        string studentId;       // Matrícula o ID del estudiante
        string degree;          // Programa académico
        string issuedDate;      // Fecha de emisión
        string documentHash;    // Hash SHA-256 del documento PDF
        address issuer;         // Dirección de la institución que lo emitió
        bool exists;            // Indica si el certificado está activo
    }

    // Emisores autorizados (instituciones)
    mapping(address => bool) public authorizedIssuers;

    // certId => Certificate
    mapping(string => Certificate) private certificates;

    address public owner;

    event IssuerAuthorized(address issuer);
    event IssuerRevoked(address issuer);
    event CertificateIssued(string certId, string studentId, string degree, address issuer);
    event CertificateRevoked(string certId, address revokedBy);

    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true;
        emit IssuerAuthorized(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el owner puede hacer esto");
        _;
    }

    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender], "No eres emisor autorizado");
        _;
    }

    /// @notice Autoriza a una nueva institucion emisora
    function authorizeIssuer(address _issuer) external onlyOwner {
        authorizedIssuers[_issuer] = true;
        emit IssuerAuthorized(_issuer);
    }

    /// @notice Revoca permisos a una institucion emisora
    function revokeIssuer(address _issuer) external onlyOwner {
        authorizedIssuers[_issuer] = false;
        emit IssuerRevoked(_issuer);
    }

    /// @notice Emite un nuevo certificado
    /// @param certId  ID unico del certificado
    /// @param studentId Matricula del estudiante
    /// @param degree Programa academico
    /// @param issuedDate Fecha de emision
    /// @param documentHash Hash SHA-256 del PDF del certificado
    function issueCertificate(
        string calldata certId,
        string calldata studentId,
        string calldata degree,
        string calldata issuedDate,
        string calldata documentHash
    ) external onlyAuthorizedIssuer {
        require(!certificates[certId].exists, "El certificado ya existe");

        certificates[certId] = Certificate({
            studentId: studentId,
            degree: degree,
            issuedDate: issuedDate,
            documentHash: documentHash,
            issuer: msg.sender,
            exists: true
        });

        emit CertificateIssued(certId, studentId, degree, msg.sender);
    }

    /// @notice Consulta un certificado por su ID
    function getCertificate(string calldata certId)
        external
        view
        returns (
            string memory studentId,
            string memory degree,
            string memory issuedDate,
            string memory documentHash,
            address issuer,
            bool exists
        )
    {
        Certificate memory cert = certificates[certId];
        return (
            cert.studentId,
            cert.degree,
            cert.issuedDate,
            cert.documentHash,
            cert.issuer,
            cert.exists
        );
    }

    /// @notice Revoca un certificado (no lo borra, solo lo marca como inexistente)
    function revokeCertificate(string calldata certId) external onlyAuthorizedIssuer {
        require(certificates[certId].exists, "El certificado no existe");
        certificates[certId].exists = false;
        emit CertificateRevoked(certId, msg.sender);
    }
}
